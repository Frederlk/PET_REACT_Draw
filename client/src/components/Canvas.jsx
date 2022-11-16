import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import axios from "axios";

import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import "../styles/canvas.scss";

const Canvas = observer(() => {
    const canvasRef = useRef();
    const usernameRef = useRef();
    const [modal, setModal] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
        let ctx = canvasRef.current.getContext("2d");
        axios.get(`http://localhost:5000/image?id=${id}`).then((response) => {
            const img = new Image();
            img.src = response.data;
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            };
        });
    }, [id]);

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket(`ws://localhost:5000/`);
            canvasState.setSocket(socket);
            canvasState.setSessionId(id);
            toolState.setTool(new Brush(canvasRef.current, socket, id));
            socket.onopen = () => {
                console.log("Подключение установлено");
                socket.send(
                    JSON.stringify({
                        id,
                        username: canvasState.username,
                        method: "connection",
                    })
                );
            };
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data);
                switch (msg.method) {
                    case "connection":
                        console.log(`пользователь ${msg.username} присоединился`);
                        break;
                    case "draw":
                        drawHandler(msg);
                        break;
                    default:
                        break;
                }
            };
        }
    }, [canvasState.username]);

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext("2d");
        console.log(figure);
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y);
                break;
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color);
                break;
            case "circle":
                Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color);
                break;
            case "finish":
                ctx.beginPath();
                break;
            default:
                break;
        }
    };

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL());
        axios
            .post(`http://localhost:5000/image?id=${id}`, { img: canvasRef.current.toDataURL() })
            .then((response) => console.log(response.data));
    };

    const connectionHandler = () => {
        if (usernameRef.current.value) {
            canvasState.setUsername(usernameRef.current.value);
            setModal(false);
        }
    };

    return (
        <div className="canvas">
            <Modal show={modal}>
                <Modal.Header>
                    <Modal.Title>Enter your name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input ref={usernameRef} type="text" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={connectionHandler}>
                        Join
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400}></canvas>
        </div>
    );
});

export default Canvas;
