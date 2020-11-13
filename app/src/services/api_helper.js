import axios from 'axios';
// redux
// import store from '../app/store';


export const api = axios.create({
    // baseURL: 'http://127.0.0.1:8000/api'
    baseURL: 'https://flow-images.herokuapp.com/api'
})

export const registerUser = async (registerData) => {
    const resp = await api.post('/users/', registerData).catch((err) => (err.response));
    let userId=null
    if (resp.status < 400 ) {
        localStorage.setItem('authToken', resp.data.access);
        const user = await api.get(`/users/${registerData.username}`);
        userId = user.data[0].id
    }
    return [resp, userId]
}

export const loginUser = async (loginData) => {
    const resp = await api.post('/token/', loginData).catch((err) => (err.response));
    let userId=null
    if (resp.status < 400 ) {
        localStorage.setItem('authToken', resp.data.access);
        const user = await api.get(`/users/${loginData.username}`);
        userId = user.data[0].id
    }
    return [resp, userId];
}

export const getImageById = async (id) => {
    const resp = await api.get(`/images/${id}`)
    .then(resp =>{return resp.data[0]});
    return resp   
}

export const editImage = async (id, edits) => {
    let actions = ''
    let changes = ''
    // Creates comma delimited strings with each method
    for (const key in edits) {
        actions += key + ','
        changes += edits[key] +','
    }
    const resp = await api.put(`/edit/image/${id}/${actions.slice(0,-1)}/${changes.slice(0,-1)}/`).then(resp => console.log(resp))
    return resp
}

export const uploadImage =  (e, creatorId, title='none') => {
    const token = localStorage.getItem('authToken');
    const payload = new FormData()
    console.log(e.target[0].files[0])
    payload.append('path', e.target[0].files[0])
    payload.append('title', title)
    payload.append('creator', creatorId)
    api.post('/images/', payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
    }
    }).then(resp =>{
        console.log(resp)
    }).catch(err => {
        console.log(err)
    })
}


export const downloadImage = (id, fileName) => {
    api.get(`/download/${id}`,{
        responseType: 'blob'
    }).then(resp => {
        // I hate this code so much, but it works
        console.log(resp)
        const url = window.URL.createObjectURL(new Blob([resp.data]))
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link)
        link.click();
        link.remove();
    }).catch(err => {console.log(err)})
}

export const downloadAscii = (id, html = 'False', fileName) => {
    api.get(`ascii/${id}/${html}/`).then(resp => {
        console.log(resp)
        const url = window.URL.createObjectURL(new Blob([resp.data]))
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link)
        link.click();
        link.remove();
    }).catch(err => {console.log(err)})

}