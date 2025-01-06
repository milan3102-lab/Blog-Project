import { useState, useRef, useEffect, useReducer } from "react";
import { db } from "../firebaseInit";
import { collection, setDoc, doc, onSnapshot, deleteDoc } from "firebase/firestore";

function blogsReducer(state, action) {
    switch (action.type) {
        case "ADD":
            return [action.blog, ...state];
        case "REMOVE":
            return state.filter((_, index) => index !== action.index);
        case "SET":
            return action.blogs;
        default:
            return state;
    }
}

export default function Blog() {
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [blogs, dispatch] = useReducer(blogsReducer, []);
    const [loading, setLoading] = useState(true);

    // useRef hook for focusing title input
    const titleRef = useRef(null);

    // Focus on Title input on mount
    useEffect(() => {
        titleRef.current.focus();
    }, []);

    // Update page title with the latest blog's title
    useEffect(() => {
        if (blogs.length && blogs[0].title) {
            document.title = blogs[0].title;
        } else {
            document.title = "Blog Page";
        }
    }, [blogs]);

    // Fetch blogs and handle real-time updates
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "blogs"), (snapshot) => {
            const fetchedBlogs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            dispatch({ type: "SET", blogs: fetchedBlogs });
            setLoading(false);
        });

        return () => unsub(); // Cleanup on unmount
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const docRef = doc(collection(db, "blogs"));
            await setDoc(docRef, {
                title: formData.title,
                content: formData.content,
                createdOn: new Date(),
            });
            setFormData({ title: "", content: "" });
            titleRef.current.focus(); // Refocus title input
        } catch (error) {
            console.error("Error adding blog:", error);
        }
    }

    async function removeBlog(id) {
        
        const docRef= doc(db,"blogs",id);
        await deleteDoc(docRef);

    }

    return (
        <>
            <h1>Write a Blog!</h1>
            <div className="section">
                {/* Form for writing the blog */}
                <form onSubmit={handleSubmit}>
                    <Row label="Title">
                        <input
                            className="input"
                            placeholder="Enter the Title of the Blog here.."
                            value={formData.title}
                            ref={titleRef}
                            onChange={(e) =>
                                setFormData({ title: e.target.value, content: formData.content })
                            }
                        />
                    </Row>

                    <Row label="Content">
                        <textarea
                            className="input content"
                            placeholder="Content of the Blog goes here.."
                            value={formData.content}
                            required
                            onChange={(e) =>
                                setFormData({ title: formData.title, content: e.target.value })
                            }
                        />
                    </Row>

                    <button className="btn">ADD</button>
                </form>
            </div>

            <hr />

            {/* Section where submitted blogs will be displayed */}
            <h2> Blogs </h2>
            {loading ? (
                <p>Loading blogs...</p>
            ) : blogs.length ? (
                blogs.map((blog, i) => (
                    <div className="blog" key={i}>
                        <h3>{blog.title}</h3>
                        <hr />
                        <p>{blog.content}</p>

                        <div className="blog-btn">
                            <button
                                onClick={() => removeBlog(blog.id)}
                                className="btn remove"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No blogs available.</p>
            )}
        </>
    );
}

// Row component for form fields
function Row(props) {
    const { label } = props;
    return (
        <>
            <label>{label}<br /></label>
            {props.children}
            <hr />
        </>
    );
}
