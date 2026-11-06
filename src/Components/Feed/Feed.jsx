import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Feed.css";
import { API_Key } from "../../data.js";
import thumbnail1 from "../../assets/thumbnail1.png";
import thumbnail2 from "../../assets/thumbnail2.png";
import thumbnail3 from "../../assets/thumbnail3.png";
import thumbnail4 from "../../assets/thumbnail4.png";
import thumbnail5 from "../../assets/thumbnail5.png";
import thumbnail6 from "../../assets/thumbnail6.png";
import thumbnail7 from "../../assets/thumbnail7.png";
import thumbnail8 from "../../assets/thumbnail8.png";
import valueConverter from "../../data.js"
import moment from "moment";

const Feed = ({ category }) => {
  const [data, setData] = useState([]);

  async function fetchData() {
    const videoListURL = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_Key}`;
    await fetch(videoListURL)
      .then((response) => response.json())
      .then((data) => setData(data.items));
  }

  useEffect(() => {
    fetchData();
    console.log(fetchData());
  }, [category]);

  return (
    <div className="feed">
      {data.map((item, index) => {
        return (
          <Link to={`/video/${item.snippet.categoryId}/${item.id}`} className="card" key={index}>
            <img src={item.snippet.thumbnails.medium.url} alt="" />
            <h2>
              {item.snippet.title}
            </h2>
            <h3>{item.snippet.channelTitle}</h3>
            <p>{valueConverter(item.statistics.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default Feed;
