// Mock 데이터
const mockVehicles = [
    { id: 1, type: "킥보드", lat: 37.123, lng: 127.123, count: 3 },
    { id: 2, type: "자전거", lat: 37.124, lng: 127.124, count: 2 },
    { id: 3, type: "킥보드", lat: 37.125, lng: 127.125, count: 1 }
];
const mockParkings = [
    { id: 1, name: "한강공원 주차장", lat: 37.125, lng: 127.125, available: true },
    { id: 2, name: "쏘카존", lat: 37.126, lng: 127.126, available: false },
    { id: 3, name: "공영주차장", lat: 37.127, lng: 127.127, available: true }
];

// 출발지/목적지 검색 폼 처리
const searchForm = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');
const vehiclesList = document.getElementById('vehiclesList');
const parkingList = document.getElementById('parkingList');

let map = null;
let markers = [];

function showMapAndMarkers(vehicles, parkings) {
    const mapDiv = document.getElementById('map');
    mapDiv.style.display = 'block';

    // 지도 초기화 (처음 한 번만)
    if (!map) {
        map = new window.kakao.maps.Map(mapDiv, {
            center: new window.kakao.maps.LatLng(37.124, 127.124), // 중앙값
            level: 3
        });
    }

    // 기존 마커 제거
    markers.forEach(m => m.setMap(null));
    markers = [];

    // 킥보드/자전거 마커
    vehicles.forEach(v => {
        const marker = new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(v.lat, v.lng),
            title: `${v.type} (${v.count}대)`,
            image: new window.kakao.maps.MarkerImage(
                v.type === "킥보드"
                    ? "https://cdn-icons-png.flaticon.com/128/3068/3068774.png"
                    : "https://cdn-icons-png.flaticon.com/128/3068/3068772.png",
                new window.kakao.maps.Size(32, 32)
            )
        });
        markers.push(marker);
    });

    // 주차장 마커
    parkings.forEach(p => {
        const marker = new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(p.lat, p.lng),
            title: p.name,
            image: new window.kakao.maps.MarkerImage(
                p.available
                    ? "https://cdn-icons-png.flaticon.com/128/684/684908.png"
                    : "https://cdn-icons-png.flaticon.com/128/1828/1828843.png",
                new window.kakao.maps.Size(32, 32)
            )
        });
        markers.push(marker);
    });

    // 지도 중심 이동 (첫 번째 킥보드/자전거 위치, 없으면 주차장)
    let centerLatLng = null;
    if (vehicles.length > 0) {
        centerLatLng = new window.kakao.maps.LatLng(vehicles[0].lat, vehicles[0].lng);
    } else if (parkings.length > 0) {
        centerLatLng = new window.kakao.maps.LatLng(parkings[0].lat, parkings[0].lng);
    }
    if (centerLatLng) map.setCenter(centerLatLng);
}

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    renderVehicles(mockVehicles);
    renderParkings(mockParkings);
    resultsDiv.classList.remove('hidden');
    showMapAndMarkers(mockVehicles, mockParkings);
});

function renderVehicles(vehicles) {
    vehiclesList.innerHTML = '';
    vehicles.forEach(v => {
        const li = document.createElement('li');
        li.textContent = `${v.type} (위치: ${v.lat.toFixed(3)}, ${v.lng.toFixed(3)}) - ${v.count}대`;
        vehiclesList.appendChild(li);
    });
}

function renderParkings(parkings) {
    parkingList.innerHTML = '';
    parkings.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.name} (위치: ${p.lat.toFixed(3)}, ${p.lng.toFixed(3)}) - ${p.available ? '주차 가능' : '주차 불가/과태료 위험'}`;
        li.style.color = p.available ? '#2563eb' : '#e11d48';
        parkingList.appendChild(li);
    });
}

// 사진 업로드 및 판별 mock
const photoForm = document.getElementById('photoForm');
const photoInput = document.getElementById('photoInput');
const photoResult = document.getElementById('photoResult');

photoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!photoInput.files.length) {
        photoResult.textContent = '사진을 업로드해주세요.';
        photoResult.style.color = '#e11d48';
        return;
    }
    // mock: 랜덤 결과
    const isAllowed = Math.random() > 0.5;
    photoResult.textContent = isAllowed ? '주차 가능한 위치입니다!' : '과태료 위험! 주차 불가 위치입니다.';
    photoResult.style.color = isAllowed ? '#2563eb' : '#e11d48';
}); 