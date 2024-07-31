// 개인 API KEY
const API_KEY = "5a3488ac1342b3f9bcf2ad06969cd295";

// 검색
// 윈도우가 준비됐을 때 해당 함수 실행
window.onload = function () {
  document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value.toLowerCase();
    const movieCards = document.querySelectorAll(".popular-movie-card");
    movieCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      if (title.includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
};

// 엔터키로 검색하기
const input = document.getElementById("search-input");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-button").click();
  }
});

// // 개봉 예정작 오픈 API 불러오기
const upcommingOpt = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer 5a3488ac1342b3f9bcf2ad06969cd295"
  }
};

// 개인 API KEY
const upcommingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=ko&page=1&region=KR`;

// 개봉 예정작 GET 요청
fetch(upcommingUrl, upcommingOpt)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const upcoming = data.results;
    const upcommingCntainer = document.getElementById("upcommingCntainer");

    upcoming.forEach((upcoming) => {
      const upcCard = createMovieCard2(upcoming);
      upcommingCntainer.appendChild(upcCard);
    });
  })
  .catch((err) => console.error(err));

// 개봉 예정작 카드 생성
function createMovieCard2(upcoming) {
  const upcCard = document.createElement("div");
  upcCard.className = "soon-movie-card";
  upcCard.innerHTML = `
        <div>
            <img src="https://image.tmdb.org/t/p/w500${upcoming.poster_path}" alt="${upcoming.title}"  class="soon-img">
        </div>
        `;
  upcCard.addEventListener("click", () => alert(`<${upcoming.title}>의 ID는 ${upcCard.id}입니다.`));
  return upcCard;
}

// top 버튼
document.getElementById("top-btn").addEventListener("click", function () {
  var body = document.getElementsByTagName("body")[0];
  //창의 스크롤을 본문 최상단으로 부드럽게 이동시킵니다.
  window.scroll({
    behavior: "smooth",
    top: body.offsetTop
  });
});

// 이미지 슬라이드 ! ! !
// 이미지 슬라이드에 쓰이는 html 요소들
const sliderContainer = document.querySelector(".swiper-container");
const sliderWrapper = sliderContainer.querySelector(".swiper-wrapper-banner");
const slides = sliderWrapper.querySelectorAll(".swiper-slide");
const prevBtn = sliderContainer.querySelector(".swiper-button-prev");
const nextBtn = sliderContainer.querySelector(".swiper-button-next");
const pagination = sliderContainer.querySelector(".swiper-pagination");

// 필요한 요소 변수로 저장
const slideCount = slides.length;
const size = slides[0].clientWidth;
let currentIndex = 1;

// 슬라이드가 배치되는 위치를 조정
function updateSliderPosition() {
  sliderWrapper.style.transform = `translateX(${-size * currentIndex + 0}px`; // 190
}

// bullet에 따라 인덱스를 조정
function updatePagination() {
  pagination.querySelectorAll(".swiper-pagination-bullet").forEach((bullet, index) => {
    bullet.classList.toggle("active", index === currentIndex);
  });
}

// 제공된 인덱스를 기준으로 슬라이드를 이동
function goToSlide(index) {
  // slideWrapper의 전환 속성
  sliderWrapper.style.transition = "0.3s ease-in-out";
  // 인덱스가 범위를 벗어나는지 확인
  // 1. 0보다 작은지, 2. 전체 인덱스의 숫자보다 크거나 같은지
  // 해당 조건을 벗어나면 currentIndex를 통해 노출 슬라이드를 조정
  if (index < 0) {
    currentIndex = slideCount - 1;
  } else if (index >= slideCount) {
    currentIndex = 0;
  } else {
    currentIndex = index;
  }
  // 노출되는 슬라이드가 설정됐으면, (위 조건문을 통해)
  // 슬라이드가 배치되는 위치를 조정하는 함수를 호출
  updateSliderPosition();
  // 페이지네이션 버튼(bullet) 조정
  updatePagination();
}

// 필요한 이벤트 리스너
// 브라우저 크기가 조정될 때마다 트리거되는 이벤트 리스너, resize
// 슬라이더의 위치가 다시 계산되고 새창 크기에 맞게 업데이트 되도록 하기위한 기능
window.addEventListener("resize", function () {
  // 슬라이드 너비 가져옴 offsetWidth(컨텐츠, 패딩, 테두리 등 요소의 너비)를 사용
  slideWidth = slides[0].offsetWidth;
  // 업데이트된 slideWidth 값을 확인하고 아래 함수를 호출해서 새너비를 기준으로 슬라이드 위치를 변경
  updateSliderPosition();
});

// 슬라이드 무한 루프를 위해 마지막 슬라이드에 도달했을 때, 인덱스가 조정
// 슬라이드 무한 루프를 위해
// 마지막 슬라이드에 도달했을 때, transitioned 이벤트 리스너가 트리거됨
sliderWrapper.addEventListener("transitioned", () => {
  // currentIndex가 마지막 인덱스일 경우(slides.length -1)
  if (currentIndex === slides.length - 1) {
    //첫 번째 인덱스로 돌아감
    currentIndex = slides.length - (slides.length - 1);
    // 슬라이더가 마지막 슬라이드에서 첫 번째 슬라이드로 부드럽게 전환하기 위함
    sliderWrapper.style.transition = "0s";
    // 무한 슬라이드에서 초기 슬라이드 값인 인덱스[1]의 위치로 재설정
    // translateX는 가로 이동 시 사용
    // -size * currentIndex는 현재 슬라이드의 위치이며, currentIndex[1]의 값이 190px 오프셋 위치에서 시작하기
    sliderWrapper.style.transform = `translateX(${
      -size * currentIndex + 190 //원래 190이었음
    }px)`;
  }
  // 첫 번째 인덱스일 경우
  if (currentIndex === 0) {
    // 마지막 슬라이드 이전 슬라이드
    currentIndex = slides.length - 2;
    sliderWrapper.style.transition = "0s";
    sliderWrapper.style.transform = `translateX(${
      -size * currentIndex + 190 // 원래 190이었음
    }px)`;
  }
});

// 버튼 및 bullet을 이용한 컨텐츠 이동
prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

pagination.querySelectorAll(".swiper-pagination-bullet").forEach((bullet, index) => {
  bullet.addEventListener("click", () => goToSlide(index));
});
