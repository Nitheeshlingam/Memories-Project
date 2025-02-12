import React, { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deletePost, likePost } from '../../../actions/posts';
import useStyles from './styles';

const Post = ({ post, setCurrentId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile")) || {};

  const userId = user?.result?.googleId || user?.result?._id;

  // Delay Image Rendering
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (post?.selectedFile) {
      setTimeout(() => {
        setImage(post.selectedFile);
      }, 500); // Adds 500ms delay before setting the image
    }
  }, [post?.selectedFile]);

  const Likes = () => {
    if (post?.likes.length > 0) {
      return post.likes.includes(userId)
        ? (<><ThumbUpAltIcon fontSize="small" /> {post.likes.length} {post.likes.length > 1 ? 'Likes' : 'Like'}</>)
        : (<><ThumbUpAltOutlined fontSize="small" /> {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</>);
    }
    return <><ThumbUpAltOutlined fontSize="small" /> Like</>;
  };

  const openPost = () => navigate(`/posts/${post._id}`);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setCurrentId(post._id);
  };

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase className={classes.cardAction} onClick={openPost}>
        <CardMedia
          className={classes.media}
          image={image || 'https://via.placeholder.com/300'} // Shows placeholder until image loads
          title={post?.title}
        />
        <div className={classes.overlay}>
          <Typography variant="h6">{post?.name}</Typography>
          <Typography variant="body2">{moment(post?.createdAt).fromNow()}</Typography>
        </div>
      </ButtonBase>

      {(userId === post?.creator) && (
        <div className={classes.overlay2}>
          <Button style={{ color: "white" }} size="small" onClick={handleEditClick}>
            <EditIcon fontSize="large" className={classes.editIcon} />
          </Button>
        </div>
      )}

      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary" component="h2">
          {post?.tags?.map((tag) => `#${tag} `).join(" ")}
        </Typography>
      </div>

      <Typography className={classes.title} variant="h5" gutterBottom>
        {post?.title}
      </Typography>

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {post?.message}
        </Typography>
      </CardContent>

      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" disabled={!user?.result} onClick={() => dispatch(likePost(post._id))}>
          <Likes />
        </Button>
        {(userId === post?.creator) && (
          <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
            <DeleteIcon fontSize="small" /> Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;
