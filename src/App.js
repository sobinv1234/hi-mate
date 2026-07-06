import React from 'react';
import PostCreate from './components/PostCreate';
import PostList from './components/PostList';
import CommentCreate from './components/CommentCreate';
import { LoadScript } from "@react-google-maps/api";

export default () => {
    return <div>
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
            libraries={["places"]}
        >
            <section className="py-5 px-2 bg-background">
                <div className="container-fluid">
                    <div className="row">
                        <h2 className='mt-3 mb-0 publish-txt'>Publish New Item</h2>
                        <PostCreate />
                    </div>
                    <div className="row">
                        <PostList />
                    </div>
                </div>
            </section>
        </LoadScript>
    </div>
}