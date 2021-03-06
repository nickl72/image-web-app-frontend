import axios from 'axios';


export const api = axios.create({
    // baseURL: 'http://127.0.0.1:8000/api'
    baseURL: 'https://flow-images.herokuapp.com/api'
})

export const registerUser = async (registerData) => {
    let resp = await api.post('/users/', registerData).catch((err) => (err.response));
    let userId=null
    if (resp.status < 400 ) {
        userId=resp.data.id;
        resp = await api.post('/token/', registerData)
        localStorage.setItem('authToken', resp.data.access);
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
    const resp = await api.put(`/edit/image/${id}/${actions.slice(0,-1)}/${changes.slice(0,-1)}/`)
    return resp
}

export const uploadImage =  (e, creatorId, title='none') => {
    const token = localStorage.getItem('authToken');
    const payload = new FormData()
    payload.append('path', e.target[0].files[0])
    payload.append('title', title)
    payload.append('creator', creatorId)
    api.post('/images/', payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
    }
    }).catch(err => {
        console.log(err)
    })
}


export const downloadImage = (id, fileName) => {
    api.get(`/download/${id}`,{
        responseType: 'blob'
    }).then(resp => {
        // I hate this code so much, but it works
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
        const url = window.URL.createObjectURL(new Blob([resp.data]))
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link)
        link.click();
        link.remove();
    }).catch(err => {console.log(err)})

}

// export const downloadExternal = () => {
//     axios.get('https://unsplash.com/photos/yC-Yzbqy7PY/download?force=true').then(resp => {console.log(resp)})
// }

export const cropImage = async (id, left, top,right, bottom) => {
    left = Math.round(left)
    top = Math.round(top)
    right = Math.round(right)
    bottom = Math.round(bottom)
    const resp = await api.get(`/crop/${id}/${left}/${top}/${right}/${bottom}/`)
    return resp
}

export const randomImages = async () => {
    const resp = await api.get('/images/random/12/');
    return resp.data
}

export const getImageSize = async (id) => {
    const resp = await api.get(`images/size/${id}/`)
    return resp.data
}

export const userImages = async (userId) => {
    const resp = await api.get(`userimages/${userId}/`);
    return resp.data
}

export const pingServer = async () => {
    api.get('')
}

export const logout_helper = () => {
    localStorage.removeItem('authToken')
}

export const copyImage = async (userId, imageId) => {
    const token = localStorage.getItem('authToken');
    const resp = await api.get(`/images/copy/${userId}/${imageId}/`)
    return resp.data
}