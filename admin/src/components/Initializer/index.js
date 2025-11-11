/**
 *
 * Initializer
 *
 */

import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import pluginId from "../../pluginId";

const Initializer = ({ setPlugin }) => {
  useEffect(() => {
    if (typeof setPlugin === "function") {
      setPlugin(pluginId);
    }
  }, [setPlugin]);

  return null;
};

Initializer.propTypes = {
  setPlugin: PropTypes.func.isRequired,
};

export default Initializer;
