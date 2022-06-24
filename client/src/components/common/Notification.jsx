import React, { useEffect } from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { close } from '../../Redux/reducer/notificationSlice';
import './Notification.css';

const Notification = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.notificationSlice.open);
    const { message, type, url } = useSelector((state) => state.notificationSlice.main);
    const timeout = useRef();

    useEffect(() => {
            startTimeout();
        // eslint-disable-next-line
    }, [isOpen]);

    let color = '';
    switch (type) {
        case 'error':
            color = 'red';
            break;
        case 'warning':
            color = 'orange';
            break;
        case 'success':
            color = 'green';
            break;
        default: color = 'rgba(0, 0, 0, .3)';
            break;
    };

    const startTimeout = () => { 
        timeout.current = setTimeout(() => {
                closeNotification();
            }, 6000);
     }

    const closeNotification = () => { 
        dispatch(close());
        if (timeout.current) clearTimeout(timeout.current);
     };

    return (
        <div 
            style={{ borderLeft: `4px solid ${color}`}}
            onClick={() => ( url
                ? [navigate(url), closeNotification()]
                : closeNotification())}
            className={`notification-container ${isOpen && 'notif-open'}`}>
            <div className={`notification-inner`}>
                <div className={`notification-timer ${isOpen && 'timer-active'}`}></div>
                <div className='notification-message'>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default Notification