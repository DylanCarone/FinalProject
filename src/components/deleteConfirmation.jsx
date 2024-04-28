import React from 'react';
import { useState } from 'react';

const DeleteConfirmation = ({ isOpen, onClose, onDelete, secret }) => {

    const [secretKey, setSecretKey] = useState('');


    const handleSecretChange = (e) => {
        setSecretKey(e.target.value);
    };


    if (!isOpen) return null;




    return (
        <div className='delete-window'>

            {!secret ? (
                <>
                    <h2>Are you sure you want to delete this post?</h2>
                    <button className="confirmation-delete-button" onClick={onDelete}>Delete</button>
                    <button onClick={onClose}>Cancel</button>
                </>

            ) : (
                <>
                    <h2>The secret key is required to delete this post</h2>
                    <input
                        id="secretKey"
                        onChange={handleSecretChange}
                        type="text"
                        placeholder="Secret Key"
                        value={secretKey} />


                    <button className={`confirmation-delete-button ${secretKey == secret ? `` : "locked"}`}
                        onClick={onDelete}
                        disabled={secretKey != secret}
                        >
                        Delete</button>
                    <button onClick={onClose}>Cancel</button>

                </>
            )}


        </div>
    );
};

export default DeleteConfirmation;