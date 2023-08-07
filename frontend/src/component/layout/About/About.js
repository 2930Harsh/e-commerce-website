import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import InstagramIcon from "@material-ui/icons/Instagram";
import TwitterIcon from '@material-ui/icons/Twitter'
import GitHubIcon from '@material-ui/icons/GitHub'

const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/2930harsh";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dvgdk5p4g/image/upload/v1690849898/Founder/Founder_jvm5gh.jpg"
              alt="Founder"
            />
            <Typography>Harsh Garg</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is an ECOMMERCE Website developed by Harsh Garg for the purpose of learning MERN STACK and 
              implementation of Technology.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Social Media Handles</Typography>
            <a
              href="https://twitter.com/harsh94165765"
              target="blank"
            >
              <TwitterIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://instagram.com/2930harsh" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
            <a href="https://github.com/2930harsh" target="blank">
              <GitHubIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
