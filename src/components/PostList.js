import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';
import { getImage } from '../config/paths';
import ConfirmModal from '../modals/ConfirmModal';

export default () => {
const [showModal, setShowModal] = useState(false);
const [selectedPostId, setSelectedPostId] = useState(null);
const openDeleteModal = (id) => {
    setSelectedPostId(id);
    setShowModal(true);
};

const deletePost = async () => {
    const id = selectedPostId;

    console.log("Deleting ID:", id); // DEBUG

    if (!id) return;

    try {
        await axios.delete(`http://localhost:4000/posts/${id}`);
        fetchPosts();
    } catch (err) {
        console.error(err);
    } finally {
        setShowModal(false);
        setSelectedPostId(null);
    }
};

const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const res = await axios.get('http://localhost:4000/posts');
        setPosts(res.data);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="row my-4">
        { fetchPosts && <h2 className='mt-3 mb-0'>Item List</h2>}
            {posts.map(post => (
                <div className="col-6 col-md-3 col-sm-4 my-3 item-list" key={post.id}>
                    <div className='card shadow-md h-100'>
                        <div className='card-body'>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5>{post.title}</h5>
                                <span className="bg-danger shadow-lg rounded-circle p-2 text-white" 
                                style={{ fontSize: '0.7rem', width: '1.5rem', padding: '0.5rem', height: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <button type="button" className="btn-close btn-close-white shadow-none" aria-label="Close"
                                    onClick={() => openDeleteModal(post.id)}
                                    ></button>
                                </span> 
                            </div>

                            <img
                                src={post.productImage || getImage('default-product.jpg')}
                                className="img-fluid mb-3 main-product-img"
                                alt={post.title}
                            />

                            <h3>£{post.productAmount}</h3>

                            <p className='product-description'>{post.description}</p>

                            <hr />

                            <CommentList postId={post.id} />
                            <CommentCreate postId={post.id} />
                        </div>

                    </div>
                </div>
            ))}
            <ConfirmModal
                show={showModal}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={() => deletePost(selectedPostId)}
                onCancel={() => {
                    setShowModal(false);
                    setSelectedPostId(null);
                }}
            />
        </div>
    );
};