import React from 'react';
import PostCreate from './components/PostCreate';
import PostList from './components/PostList';
import CommentCreate from './components/CommentCreate';

export default () => {
    return <div>
        <section className="py-5 px-2 bg-light">
            <div className="container-fluid">
                <div className="row">
                    <h1 className='my-3'>Publish New Item</h1>
                    <PostCreate />
                </div>
                <div className="row">
                    <PostList />
                </div>
            </div>
        </section>
    </div>
}