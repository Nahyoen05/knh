document.addEventListener("DOMContentLoaded", () => {
    const portfolioForm = document.getElementById("portfolio-form");

    // 1. 인라인 텍스트 편집기 기능 실행
    setupEditableElements();

    // 2. 초기 기본 데모 포트폴리오 데이터 세팅 (버전 v7)
    initDefaultProjects();

    // 3. 저장된 포트폴리오 아이템 불러와 화면에 그리기
    loadPortfolioItems();

    // 4. 셀렉트 박스 카테고리 종류 변경 시 조회수 칸 제어 (오류 방지 예외처리 포함)
    const contentTypeSelect = document.getElementById("content-type");
    const viewGroup = document.getElementById("view-input-group");
    
    if (contentTypeSelect && viewGroup) {
        // 초기 상태 로드 시 기본 체크
        if (contentTypeSelect.value === "youtube") {
            viewGroup.style.display = "flex";
        } else {
            viewGroup.style.display = "none";
        }

        // 사용자가 선택을 바꿀 때마다 실행
        contentTypeSelect.addEventListener("change", () => {
            if (contentTypeSelect.value === "youtube") {
                viewGroup.style.display = "flex";
            } else {
                viewGroup.style.display = "none";
            }
        });
    }

    // 5. 신규 프로젝트 등록 폼 제출 이벤트
    if (portfolioForm) {
        portfolioForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const titleEl = document.getElementById("content-title");
            const typeEl = document.getElementById("content-type");
            const urlEl = document.getElementById("content-url");
            const viewsEl = document.getElementById("content-views");
            const thumbEl = document.getElementById("content-thumb");

            if (!titleEl || !typeEl || !urlEl) return;

            const title = titleEl.value;
            const type = typeEl.value;
            const url = urlEl.value;
            const customViews = viewsEl ? viewsEl.value : "";
            const thumbInput = thumbEl ? thumbEl.value : "";

            // 썸네일 전처리 (비어있을 경우 타입별 기본 이미지 연결)
            let finalThumb = thumbInput.trim();
            if (!finalThumb) {
                if (type === "youtube") finalThumb = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600";
                else if (type === "web") finalThumb = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600";
                else finalThumb = "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600";
            }

            const newItem = {
                id: Date.now().toString(),
                title: title,
                type: type,
                url: url,
                thumb: finalThumb,
                baseViews: type === "youtube" ? (customViews ? parseInt(customViews, 10) : 0) : null
            };

            saveItemToStorage(newItem);
            renderItem(newItem);
            
            // 폼 초기화 및 조회수 인풋 상태 정돈
            portfolioForm.reset();
            if (viewGroup) viewGroup.style.display = "flex";
        });
    }

    function initDefaultProjects() {
        if (!localStorage.getItem("notion_portfolio_items_v7")) {
            const defaults = [
                {
                    id: "default_1",
                    title: "포항 덮밥 맛집 홍보 숏폼",
                    type: "youtube",
                    url: "https://youtube.com/shorts/M84Y7XZRWl0",
                    thumb: "image_f5247b.jpg", 
                    baseViews: 1747
                },
                {
                    id: "default_2",
                    title: "포항 핫플 카페 드라마 촬영지 숏폼",
                    type: "youtube",
                    url: "https://youtube.com/shorts/aal8nttxdS0",
                    thumb: "image_f52480.jpg", 
                    baseViews: 339
                },
                {
                    id: "default_3",
                    title: "Odin in Pohang 브랜드 사이트",
                    type: "web",
                    url: "https://odin-in-pohang.aiapp.link/",
                    thumb: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600",
                    baseViews: null
                }
            ];
            localStorage.setItem("notion_portfolio_items_v7", JSON.stringify(defaults));
        }
    }

    function renderItem(item) {
        const targetGrid = document.getElementById("grid-" + item.type);
        if (!targetGrid) return;

        const card = document.createElement("a");
        card.className = "project-card";
        card.href = item.url;
        card.target = "_blank";
        card.setAttribute("data-id", item.id);

        let tagText = "DOCUMENT";
        let tagClass = "doc-tag";
        if (item.type === "youtube") { tagText = "AI VIDEO"; tagClass = "video-tag"; }
        if (item.type === "web") { tagText = "AI WEBSITE"; tagClass = "web-tag"; }

        let statsHtml = "";
        if (item.type === "youtube" && item.baseViews !== null) {
            statsHtml = `
                <div class="live-stats">
                    <span><i class="fa-solid fa-eye"></i> 조회수 <strong>${item.baseViews.toLocaleString()}회</strong></span>
                    <span><i class="fa-solid fa-heart"></i> 추천 콘텐츠</span>
                </div>
            `;
        }

        card.innerHTML = `
            <button class="card-delete-btn" data-id="${item.id}">삭제</button>
            <div class="media-wrapper">
                <img src="${item.thumb}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'">
            </div>
            <div class="card-info">
                <span class="tag ${tagClass}">${tagText}</span>
                <h3>${item.title}</h3>
                ${statsHtml}
            </div>
        `;

        // 카드 내 삭제 버튼 클릭 핸들러
        const deleteBtn = card.querySelector(".card-delete-btn");
        if (deleteBtn) {
            deleteBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm("이 프로젝트를 포트폴리오에서 제거할까요?")) {
                    deleteItemFromStorage(item.id);
                    card.remove();
                }
            });
        }

        // 가장 최신 항목이 맨 앞으로 오도록 배치
        targetGrid.insertBefore(card, targetGrid.firstChild);
    }

    function setupEditableElements() {
        const editableIds = ["edit-title", "edit-subtitle", "edit-bio", "edit-exp", "edit-skills"];
        
        editableIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            
            const savedData = localStorage.getItem("editable_v7_" + id);
            if (savedData) {
                el.innerHTML = savedData;
            }

            el.addEventListener("blur", () => {
                localStorage.setItem("editable_v7_" + id, el.innerHTML);
            });
        });
    }

    function saveItemToStorage(item) {
        let items = JSON.parse(localStorage.getItem("notion_portfolio_items_v7")) || [];
        items.push(item);
        localStorage.setItem("notion_portfolio_items_v7", JSON.stringify(items));
    }

    function loadPortfolioItems() {
        let items = JSON.parse(localStorage.getItem("notion_portfolio_items_v7")) || [];
        items.forEach(item => renderItem(item));
    }

    function deleteItemFromStorage(id) {
        let items = JSON.parse(localStorage.getItem("notion_portfolio_items_v7")) || [];
        items = items.filter(item => item.id !== id);
        localStorage.setItem("notion_portfolio_items_v7", JSON.stringify(items));
    }
});