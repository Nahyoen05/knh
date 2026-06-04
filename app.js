document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 포트폴리오 고정 마스터 데이터 (조회수 표시 제거 상태)
    const portfolioData = [
        // ======= [카테고리 1] AI 영상 프로젝트 =======
        {
            id: "video_1",
            title: "이건 무조건 저장해야됨🔥포항 덮밥 맛집",
            type: "youtube",
            url: "https://www.youtube.com/shorts/M84Y7XZRWl0",
            thumb: "thumb_food.jpg"
        },
        {
            id: "video_2",
            title: "드라마 촬영지 실화냐🔥포항 핫플 카페",
            type: "youtube",
            url: "https://youtube.com/shorts/aal8nttxdS0?si=asRKJDr-lRUowmW2",
            thumb: "thumb_cafe.jpg"
        },
        
        // ======= [카테고리 2] AI 웹사이트 프로젝트 =======
        {
            id: "web_1",
            title: "포항 ODIN 웹사이트",
            type: "web",
            url: "https://odin-in-pohang.aiapp.link/",
            thumb: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250621_280%2F1750471970055KzxPT_JPEG%2F%25C1%25A4.jpg"
        },

        // ======= [카테고리 3] 구글 문서 및 기획서 자료 =======
        {
            id: "doc_1",
            title: "포항 러블랑 굿즈 기획서",
            type: "document",
            url: "https://docs.google.com/document/d/1DL1HlW91dxQx8y8mfFGZ9nMadtaP8nAenyTAjoaB9UQ/edit?tab=t.0",
            thumb: "thumb_doc.jpg"
        }
    ];

    setupEditableElements();
    renderPortfolioList(portfolioData);

    // 2. 포트폴리오 화면 렌더링 함수
    function renderPortfolioList(items) {
        const grids = {
            youtube: document.getElementById("grid-youtube"),
            web: document.getElementById("grid-web"),
            document: document.getElementById("grid-document")
        };

        if (grids.youtube) grids.youtube.innerHTML = "";
        if (grids.web) grids.web.innerHTML = "";
        if (grids.document) grids.document.innerHTML = "";

        items.forEach(item => {
            const targetGrid = grids[item.type];
            if (!targetGrid) return;

            const card = document.createElement("a");
            card.className = "project-card";
            card.href = item.url;
            card.target = "_blank";

            let tagText = "DOCUMENT";
            let tagClass = "doc-tag";
            if (item.type === "youtube") { tagText = "AI VIDEO"; tagClass = "video-tag"; }
            if (item.type === "web") { tagText = "AI WEBSITE"; tagClass = "web-tag"; }

            // 💡 이 구역 안에 있던 하단 'live-stats'(조회수 및 아이콘) 구조를 완벽하게 들어내어 완전히 빈 상태로 고정했습니다.
            card.innerHTML = `
                <div class="media-wrapper">
                    <img src="${item.thumb}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'">
                </div>
                <div class="card-info">
                    <span class="tag ${tagClass}">${tagText}</span>
                    <h3>${item.title}</h3>
                </div>
            `;

            targetGrid.appendChild(card);
        });
    }

    // 3. 프로필 편집 데이터 우회 연동 함수
    function setupEditableElements() {
        const editableIds = ["edit-title", "edit-subtitle", "edit-bio", "edit-exp", "edit-skills"];
        editableIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const savedData = localStorage.getItem("editable_final_v2_" + id);
            if (savedData && savedData.trim() !== "") {
                el.innerHTML = savedData;
            }
            el.addEventListener("blur", () => {
                localStorage.setItem("editable_final_v2_" + id, el.innerHTML);
            });
        });
    }
});