document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 내가 등록한 고정 포트폴리오 리스트 마스터 데이터 (영구 박제)
    const portfolioData = [
        // ======= [카테고리 1] AI 영상 프로젝트 =======
        {
            id: "video_1",
            title: "이건 무조건 저장해야됨🔥포항 덮밥 맛집",
            type: "youtube",
            url: "https://www.youtube.com/shorts/M84Y7XZRWl0",
            thumb: "https://media.discordapp.net/attachments/529143536625385487/1511641714002235432/20240511_1202161.jpg?ex=6a21318d&is=6a1fe00d&hm=3a8e0fba6343fd321ddb21e247bebf283577eee941db7e698b417de97ca1e7b6&=&format=webp&width=1038&height=960", 
            baseViews: 1750
        },
        {
            id: "video_2",
            title: "드라마 촬영지 실화냐🔥포항 핫플 카페",
            type: "youtube",
            url: "https://youtube.com/shorts/aal8nttxdS0?si=asRKJDr-lRUowmW2",
            thumb: "https://media.discordapp.net/attachments/529143536625385487/1511641632208851094/20260328_104552.jpg?ex=6a21317a&is=6a1fdffa&hm=a140398427982a92b08ad5824ae3755a0df8ec6009a843bac41fe6509fcda07a&=&format=webp&width=961&height=960", 
            baseViews: 342
        },
        
        // ======= [카테고리 2] AI 웹사이트 프로젝트 =======
        {
            id: "web_1",
            title: "포항 ODIN 웹사이트",
            type: "web",
            url: "https://odin-in-pohang.aiapp.link/",
            thumb: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250621_280%2F1750471970055KzxPT_JPEG%2F%25C1%25A4.jpg",
            baseViews: null
        },

        // ======= [카테고리 3] 구글 문서 및 기획서 자료 =======
        {
            id: "doc_1",
            title: "포항 러블랑 굿즈 기획서",
            type: "document",
            url: "https://docs.google.com/document/d/1DL1HlW91dxQx8y8mfFGZ9nMadtaP8nAenyTAjoaB9UQ/edit?tab=t.0",
            thumb: "https://media.discordapp.net/attachments/529143536625385487/1511700084281184397/2026-06-03_205611.png?ex=6a2167ea&is=6a20166a&hm=4e067ae0139f7a0dceedd19bed28c953072a93a50d091ed74ed96f73ef0450f6&=&format=webp&quality=lossless",
            baseViews: null
        }
    ];

    // 2. 인라인 상단 프로필 데이터 세팅 연동 (오류 완벽 방지 우회 로직 추가)
    setupEditableElements();

    // 3. 고정 포트폴리오 리스트 화면에 뿌리기
    renderPortfolioList(portfolioData);


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
                <div class="media-wrapper">
                    <img src="${item.thumb}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'">
                </div>
                <div class="card-info">
                    <span class="tag ${tagClass}">${tagText}</span>
                    <h3>${item.title}</h3>
                    ${statsHtml}
                </div>
            `;

            targetGrid.appendChild(card);
        });
    }

    function setupEditableElements() {
        const editableIds = ["edit-title", "edit-subtitle", "edit-bio", "edit-exp", "edit-skills"];
        
        editableIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return; // 요소가 존재하지 않으면 그냥 에러 없이 건너뛰도록 방어 코딩 처리
            
            const savedData = localStorage.getItem("editable_final_" + id);
            if (savedData && savedData.trim() !== "") {
                el.innerHTML = savedData;
            }

            el.addEventListener("blur", () => {
                localStorage.setItem("editable_final_" + id, el.innerHTML);
            });
        });
    }
});