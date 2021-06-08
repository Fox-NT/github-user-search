import Swal from 'sweetalert2'

const form = document.querySelector('form');
const input = form.querySelector('#search');

const profile = document.querySelector('.profile');
const avatar = profile.querySelector('.profile__avatar');
const info = profile.querySelector('.user');
const name = info.querySelector('.name');
const nickname = info.querySelector('.nickname');
const descr = info.querySelector('.user__descr');
const stats = info.querySelector('.stats');
const followers = stats.querySelector('.followers');
const followersCount = followers.querySelector('.followers__count');
const following = stats.querySelector('.following');
const followingCount = following.querySelector('.following__count');
const repos = stats.querySelector('.repos');
const reposCount = repos.querySelector('.repos__count');
const reposList = profile.querySelector('.profile__repository');

const API = 'https://api.github.com/users/';

let user;

const getDate = async url => {
    const res = await fetch(url);
    console.log(res.status);
    if(res.status === 404 || res.status === 403) {
        Swal.fire({
            title: 'Ошибка 404',
            text: "Пользователь с таким ником не найдет в GitHub",
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#935214',
            confirmButtonText: '<a href="./" style="color: #fff">Назад</a>'
        })
    }
    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, error code: ${res.status}`);
    }
    return await res.json();
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    user = input.value;
    const url = API+user;

    getDate(url).then(data => {
        // console.log(data);
        input.value = '';
        profile.style.display = 'flex';
        const member = {
            avatar: data.avatar_url || 'https://yt3.ggpht.com/a/AATXAJw49mO4EyxKLWWet2p1O61U0IlIUA1NhcKM_w=s900-c-k-c0xffffffff-no-rj-mo',
            name: data.name || 'Имя не указано',
            nickname: data.login,
            descr: data.bio || `Биография отсутствует...`,
            followers: data.followers,
            following: data.following,
            repos: data.public_repos
        }
        console.log(member.avatar)
            avatar.innerHTML = `<img src="${member.avatar}" alt='${member.login}'>`;
            name.textContent = member.name;
            nickname.textContent = member.nickname;
            descr.textContent = member.descr;
            followersCount.textContent = member.followers;
            followingCount.textContent = member.following;
            reposCount.textContent = member.repos;

        getDate(url+'/repos').then(repos => {
            reposList.innerHTML = '';
            const replist = document.createElement('ul');
            reposList.append(replist);
            repos.map(reps => {
                const rep = document.createElement('li')
                rep.innerHTML = `<a href='${reps.html_url}'>${reps.name}</a>`;
                replist.append(rep);
            })
        })
    })
})

