import React, { useState, useEffect, useRef } from 'react';
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
    // filter

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    const filteredPosts = posts.filter((post) =>
        post.title?.toLowerCase().includes(search.toLowerCase())
        // || post.description.toLowerCase().includes(search.toLowerCase())
    );


    // Pagination
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;


    const currentPosts = filteredPosts.slice(
        indexOfFirstPost,
        indexOfLastPost
    );
    // toggle button
    const searchRef = useRef(null);

    const [showTopButton, setShowTopButton] = useState(false);


    useEffect(() => {

        const handleScroll = () => {

            if (searchRef.current) {

                const searchTop = searchRef.current.getBoundingClientRect().top;

                // If search section is visible at top area
                if (searchTop <= 80) {
                    setShowTopButton(true);
                } else {
                    setShowTopButton(false);
                }

            }

        };


        window.addEventListener("scroll", handleScroll);

        // Run once when component loads
        handleScroll();


        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, []);
    const scrollToSearch = () => {

        searchRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    };


    const scrollToTop = () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };
    return (
        <div className="row my-4">
            <div ref={searchRef} className="d-flex justify-content-between align-items-center mt-3 mb-3">
                <h2 className="mb-0">Item List</h2>

                <div className="input-group" style={{ maxWidth: "320px" }}>
                    <span className="input-group-text">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>
            {currentPosts.map(post => (
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
            <div className="d-flex justify-content-center mt-4">

                <nav>
                    <ul className="pagination">

                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""
                            }`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </button>
                        </li>


                        {[...Array(totalPages)].map((_, index) => (

                            <li
                                key={index}
                                className={`page-item ${currentPage === index + 1
                                        ? "active"
                                        : ""
                                    }`}
                            >

                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>

                            </li>

                        ))}


                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""
                            }`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </button>
                        </li>

                    </ul>
                </nav>
                <button
                    onClick={() => {
                        if (showTopButton) {
                            scrollToTop();
                        } else {
                            scrollToSearch();
                        }
                    }}
                    className="scroll-search-btn  d-flex justify-content-center align-items-center"
                >
                    {showTopButton ? <i class="fa-solid fa-arrow-up p-0" style={{ fontSize: '18px' }}></i>
                        : <i class="fa-solid fa-magnifying-glass p-0" style={{ fontSize: '18px' }}></i>}
                </button>
            </div>
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