import React from "react";
import { Link } from "react-router-dom";
import btbBanner from "../../../Assets/BtbBanner.png";

const CompeteBanners = () => (
  <div className="competeBanners">
    <Link to="/compete/beat-the-bettor">
      <img src={btbBanner} alt="Beat the Bettor" />
    </Link>
  </div>
);

export default CompeteBanners;
