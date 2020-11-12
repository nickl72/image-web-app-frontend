import React, { useState } from 'react';
import { Edit } from '../styles/Edit';
import { getImageById, editImage, uploadImage } from '../services/api_helper';

const EditImage = () => {
    const [image, setImage] = useState(null)
    const [edits, setEdits] = useState({
        brightness: 1,
        blur: 0,
        red: 0,
        green: 0,
        blue: 0
    })
    if (!image) {
        getImageById(22).then(resp => {
            setImage(resp.path)
        })
    }
        
    const handleChange = (e) => {
        e.preventDefault();
        const update = Object.assign({}, edits)
        update[e.target.name] = e.target.value
        setEdits(update)
    }

    return (
        <Edit>
            <div>
                <h2>Edit</h2>
                <h3>Brightness</h3>
                <input type='range' name='brightness' min='0' max='2' step='.01' value={edits.brightness} onChange={handleChange}/>
                <h3>Blur</h3>
                <input type='range' name='blur' min='0' max='5' onChange={handleChange}/>
                <h3>Color</h3>
                <h4>Red: {edits.red}</h4>
                <input type='range' name='red' min='-255' max='255' onChange={handleChange}/>
                <h4>Green: {edits.green}</h4>
                <input type='range' name='green' min='-255' max='255' onChange={handleChange}/>
                <h4>Blue: {edits.blue}</h4>
                <input type='range' name='blue' min='-255' max='255' onChange={handleChange}/>

                <h3>Insert Image</h3>
                <p>upload: </p>
                <form onSubmit={uploadImage}>
                    {/* <input type='text' name='title' /> */}
                    <input type='file' name='path' />
                    {/* <select name='creator'><option value='1'>1</option></select> */}
                    <input type='submit' value = 'Upload' />
                </form>
                <p>select from library</p>
                <input type='text' />
                <p><a href='#'>Crop</a></p>

                <p><a href='#' onClick={() => editImage(22, edits)}>download image</a></p>
                <p>Download as: </p><select>
                    <option>JPEG</option>
                    <option>ASCII</option>
                </select>

            </div>
            <div className='image'>
                {image && <img src={`${image}`} alt='' />}
                <p>-<input type='range' />+</p>
            </div>
        </Edit>
    )
}

export default EditImage