import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PropTypes } from "prop-types";

const BottomBtn = ( {text, colorClass, icon, onBtnClick} ) => {
    return(
        <button
            type = "button"
            className = {`btn btn-block no-border ${colorClass}`}
        >
            <FontAwesomeIcon 
                icon={icon} 
                size="lg" 
                onClick={onBtnClick}
            />
            {text}
        </button>
    )
}

BottomBtn.propTypes = {
    text: PropTypes.string,
    colorClass: PropTypes.string,
    icon: PropTypes.object.isRequired,
    onBtnClick: PropTypes.func,
}
export default BottomBtn