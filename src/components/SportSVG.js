import React from 'react';
import { FaVolleyballBall, FaBasketballBall, FaFutbol, FaTableTennis, FaRegCircle, FaUtensilSpoon, /* FaPlus */ } from "react-icons/fa";
import { MdSportsTennis, MdSportsHandball } from "react-icons/md";

export default function SportSVG(props) {
    function WhatLogo() {
        if (props.what === "volleyball") {
            return (
                <FaVolleyballBall />
            );
        } else if (props.what === "basketball") {
            return (
                <FaBasketballBall />
            );
        } else if (props.what === "football") {
            return (
                <FaFutbol />
            );
        } else if (props.what === "badminton") {
            return (
                <FaUtensilSpoon />
            );
        } else if (props.what === "tennis") {
            return (
                <MdSportsTennis />
            );
        } else if (props.what === "handball") {
            return (
                <MdSportsHandball />
            );
        } else if (props.what === "table tennis") {
            return (
                <FaTableTennis />
            );
        } else if (props.what === "frisbee") {
            return (
                <FaRegCircle />
            );
        } else {
            return (
                <div></div>
            )
        }
    }
  return (
    <div>
        <WhatLogo />
    </div>
  )
}
