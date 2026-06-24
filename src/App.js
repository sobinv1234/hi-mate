import React from 'react';
import PostCreate from './components/PostCreate';
import PostList from './components/PostList';
import CommentCreate from './components/CommentCreate';

export default () => {
    return <div>
        <section className="py-5 bg-white">
            <div className="container">
                <div className="row">
                    <h1 className='my-3'>Publish New Item</h1>
                    <PostCreate />
                </div>
                <div className="row">
                    <h1 className='my-3'>Item List</h1>
                    <PostList />
                </div>
            </div>
        </section>
    </div>
}