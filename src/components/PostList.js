import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';
import { getImage } from '../config/paths';

export default () => {

    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const res = await axios.get('http://localhost:4000/posts');
        setPosts(res.data);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="row">
            { posts.map(post => (
                <div className="col-6 col-md-3 col-sm-4 my-3 item-list" key={post.id}>
                    <div className='card shadow-lg'>

                        <div className='card-body'>
                            <h5>{post.title}</h5>

                            <img
    src={post.productImage || getImage('default-product.jpg')}
    className="img-fluid mb-3 main-product-img"
    alt={post.title}
/>

                            <h3>£{post.productAmount}</h3>

                            <p>{post.description}</p>

                            <hr />

                            <CommentList postId={post.id} />
                            <CommentCreate postId={post.id} />
                        </div>

                    </div>
                </div>
            ))}

        </div>
    );
};