//  Init Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiaGVrdHIiLCJhIjoiY2pvM2NqYXU2MHQ3bjNwbnNuZGxwdmU1NiJ9.NPQJL5jUnYbId3pn5OqKdg';

let map = new mapboxgl.Map({
    container: 'map__user-map',
    center: [-122.420679, 37.772537],
    zoom: 13,
    style: 'mapbox://styles/mapbox/streets-v9',
    hash: true,
    transformRequest: (url, resourceType)=> {
        if(resourceType === 'Source' && url.startsWith('http://myHost')) {
            return {
                url: url.replace('http', 'https'),
                headers: { 'my-custom-header': true},
                credentials: 'include'  // Include cookies for cross-origin requests
            };
        } 
    }
});

const displayUserMapBtn = document.querySelector('.display__user-map');
displayUserMapBtn.addEventListener('click', () => {
    const userImageEl = document.querySelector('.user__image');
    const userMapEl = document.querySelector('.map__user-map');

    if(userImageEl.style.display !== 'none') {
        userImageEl.style.display = 'none';
        userMapEl.style.display = 'block';
    } else if(userImageEl.style.display === 'none') {
        userImageEl.style.display = 'block';
        userMapEl.style.display = 'none';
    }
})