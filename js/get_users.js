//  ↓↓↓↓↓↓ Please check this if users can't be displayed properly
console.log('%c Notification in blue', 'background: #559; color: #fff');

window.onload = () => {
    if(localStorage.length <= 1) {
        localStorage.clear();
        index = 1;
        fetchUsers(10);
    } else {
        console.log('Displaying previously fetched users')
        displayUser(index); // store last index and replace here @@@@@@@@@@@@@@@@@
    }
    const userDbRequest = window.indexedDB.open('tinderUser', 4);
    userDbRequest.onupgradeneeded = ((e) => {
        const result = e.target.result;
        const userObjS = result.createObjectStore('user', { autoIncrement: true });
    });
    userDbRequest.onerror = ((e) => {
        const error = e.target.error;
        console.error(`IndexedDB: error loading database ${error}`);
    });
    userDbRequest.onsuccess = ((e) => {
        const db = userDbRequest.result;
        let tx = db.transaction('user', 'readwrite');
        let store = tx.objectStore('user');
        store.put({
                firstname: 'Hektor',
                lastname: 'Misplon',
                age: 20
        });
        tx.oncomplete = (() => {
            db.close();
        });
    });
};

let index = 0; //           @@@ THIS SHOULD NOT BE SET TO THE GLOBAL SCOPE

//  fetch 10 users from 'randomuser.me' API & store necessary data in localStorage
function fetchUsers (numOfUsers) {
    console.log('Fetching 10 new users');
    fetch(`https://randomuser.me/api/?results=${numOfUsers}`)
    .then(response => response.json())
    .then((data) => {
        let users = data.results;
        console.log(users);
        users = users.map(user => {
            user = {
                uuid:       user.login.uuid,
                name:       user.name.first,
                age:        user.dob.age,
                gender:     user.gender,
                location:   user.location.city,
                coords:     user.location.coordinates,
                img:        user.picture.large,
                liked:      null
            };
            localStorage.setItem(user.uuid, JSON.stringify(user));
        });
    })
    .catch(error => console.error(`Could not fetch data | ${error}.`));
}

//  display the user object to the DOM
function displayUser(index) {
    const user = JSON.parse(localStorage.getItem(localStorage.key(index)));
    document.querySelector('.user__image').setAttribute('src', user.img);
    document.querySelector('.user__name').textContent = user.name;
    document.querySelector('.user__age').textContent = user.age;
    document.querySelector('.user__gender').textContent = user.gender;
    document.querySelector('.user__location').textContent = user.location;
    user.coords !== undefined ? displayUserLocation(index) : 'Could not display user location';
}

//  store 'liked' value to user - if 10 users evaluated fetch 10 new users
function evaluateUser(evaluation) {
    //liked ? console.log('liked') : console.log('disliked');
    const currentUser = JSON.parse(localStorage.getItem(localStorage.key(index)));
    evaluation ? currentUser.liked = true : currentUser.liked = false;
    localStorage.setItem(localStorage.key(index), JSON.stringify(currentUser));

    if(index < localStorage.length -1 ) {
        index += 1;
        displayUser(index);
    } else {
        fetchUsers(10);
    }
    displayLikes(currentUser);
    console.log(localStorage);
}

//  event listeners for the like and dislike buttons
document.querySelector('.evaluation__button--like').addEventListener('click', () => evaluateUser(true));
document.querySelector('.evaluation__button--dislike').addEventListener('click', () => evaluateUser(false));

//function to display who you liked and who you disliked
function displayLikes(user) {
    if(user.liked) {
        const likedUserEl = document.createElement('li');
        document.querySelector('.evaluation-display__list--likes').appendChild(likedUserEl);
        likedUserEl.textContent = `${user.name}`;
    } else if(user.liked === false) {
        const dislikedUserEl = document.createElement('li');
        document.querySelector('.evaluation-display__list--dislikes').appendChild(dislikedUserEl);
        dislikedUserEl.textContent = `${user.name}`;
    } else {
        console.error('Error displaying user evaluation.');
    }
}