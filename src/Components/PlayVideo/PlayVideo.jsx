import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import { API_Key } from "../../data.js";
import video1 from "../../assets/video.mp4";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import jack from "../../assets/jack.png";
import { useParams, useSearchParams } from "react-router-dom";
import valueConverter from "../../data.js";
import moment from "moment";

const PlayVideo = () => {
  const{videoId} =useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  async function fetchVideoData() {
    // fetching video data
    const videoDetailsURL = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_Key}`;
    await fetch(videoDetailsURL)
      .then((response) => response.json())
      .then((data) => setApiData(data.items[0]));
  }

  async function fetchOtherData() {
    // fetching channel data
    const channelDetailsURL = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_Key}`;
    await fetch(channelDetailsURL)
      .then((response) => response.json())
      .then((data) => setChannelData(data.items[0]));

    // fetching comment data
    const commentURL = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_Key}`;
    await fetch(commentURL)
      .then((response) => response.json())
      .then((data) => setCommentData(data.items));
  }

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchOtherData();
  }, [apiData]);

  return (
    <div className="play-video">
      {/* <video src={video1} controls autoPlay muted></video> */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
      <div className="play-video-info">
        <p>
          {apiData
            ? valueConverter(apiData.statistics.viewCount)
            : "Views Here"}{" "}
          views &bull;{" "}
          {apiData
            ? moment(apiData.snippet.publishedAt).fromNow()
            : "Published Date"}
        </p>
        <div>
          <span>
            <img src={like} alt="" />{" "}
            {apiData
              ? valueConverter(apiData.statistics.likeCount)
              : "Likes Here"}
          </span>
          <span>
            <img src={dislike} alt="" /> 24
          </span>
          <span>
            <img src={share} alt="" /> Share
          </span>
          <span>
            <img src={save} alt="" /> Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img
          src={channelData ? channelData.snippet.thumbnails.default.url : jack}
          alt=""
        />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : "Channel Name"}</p>
          <span>
            {channelData
              ? valueConverter(channelData.statistics.subscriberCount)
              : "Subscribers Here"}{" "}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>
          {apiData ? apiData.snippet.description.slice(0, 250) : "Channel Name"}
        </p>
        <hr />
        <h4>
          {apiData
            ? valueConverter(apiData.statistics.commentCount)
            : "Views Here"}{" "}
          Comments
        </h4>
        {commentData.map((item, index) => {
          return (
            <div className="comment" key={index}>
              <img
                src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
                alt=""
              />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                  <span>
                    {moment(
                      item.snippet.topLevelComment.snippet.publishedAt,
                    ).fromNow()}
                  </span>
                </h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                  <span>
                    <img src={like} alt="" />{" "}
                    {valueConverter(
                      item.snippet.topLevelComment.snippet.likeCount,
                    )}
                  </span>
                  <span>
                    <img src={dislike} alt="" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayVideo;
