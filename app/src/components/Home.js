import React, {useState} from 'react';
import {Image} from '../styles/Home'
import { randomImages} from '../services/api_helper';
import { Link } from 'react-router-dom';
import { openModal, setActiveImage } from '../features/activeImageSlice';
import { useDispatch } from 'react-redux';

const Home = () => {
    const dispatch = useDispatch();
    const [images, setImages] = useState(null)
    const callApi = async () => {
        const images = await randomImages()
        setImages(images)
    }
    if (!images) {
        callApi()
    }
    const handleclick = (e, img) => {
        e.preventDefault()
        dispatch(setActiveImage(img))
        dispatch(openModal())
    }

    return (
        <>
            { images && images.map((img, key) => 
                <a onClick={(e) => handleclick(e,img)} key={key}>
                    <Image src={img.path} alt='' />
                </a>
            )}
        </>
    )
}

export default Home