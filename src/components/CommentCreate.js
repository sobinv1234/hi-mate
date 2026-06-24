import React, { useState } from 'react';
import axios from 'axios';

export default ({ postId }) => {
    const [comments, setComments] = useState('');
    const onSubmit = async (event) => {
        event.preventDefault();
        await axios.post(`http://localhost:4001/posts/${postId}/comments`, { content: comments });
        setComments('');
    }
    return <div className='card shadow-lg'>
                <div className='card-body'>
                    <form className="form-group" onSubmit={onSubmit}>
                        <div className="float-left d-flex flex-column">
                            <label><i>Offers and Comments</i></label>
                            <textarea className="formControl w-100 my-3 p-2" rows="3" value={comments} 
                            onChange={e => setComments(e.target.value)} placeholder="10% Off if you buy 3 items in-store" />
                            <button className="btn btn-primary float-left" disabled={!comments.trim()}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
}