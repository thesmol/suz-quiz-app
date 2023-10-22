import React, { useState } from 'react';
import Modal from 'react-modal';
import './Instruction.css';
import close from "./close-modal.svg"

const ModalWindow = ({ titleId, title, onCloseClick, modalText, styles }) => {
    return (
        <div className='modalWindow'>
            <div className='modalWindow__header'>
                <h1 id={titleId} className='modalWindow__title'>{title}</h1>
                <div className='modalWindow__icons'>
                    <img src={close} alt="close" onClick={onCloseClick} />
                </div>
            </div>

            <div className='modalWindow__content'>
                {modalText.map((item, index) => (
                    <div key={index} className={styles.conteiner} style = {{display: 'flex', flexDirection: 'column'}}>
                        <h3 style={{marginBottom: '20px'}}>{item.title}</h3>
                        {item.text.map((span, index) => (
                            <p key={index} style = {{marginBottom: '15px'}}>{span}</p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

const Instraction = ({ styles, instractionText }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const customStyles = {
        overlay: { zIndex: 1000 }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={styles.button} style={{ width: '200px' }} onClick={openModal}>
                Инструкция
            </button>
            <Modal
                onAfterOpen={() => document.body.style.overflow = 'hidden'}
                onAfterClose={() => document.body.style.overflow = 'unset'}
                style={customStyles}
                isOpen={modalIsOpen}
                closeTimeoutMS={500}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                ariaHideApp={false}
            >
                <ModalWindow
                    titleId="modal-modal-title"
                    title="Инструкция по применению"
                    onCloseClick={closeModal}
                    modalText={instractionText}
                    styles={styles}
                />
            </Modal>
        </div>
    )
}

export default Instraction;