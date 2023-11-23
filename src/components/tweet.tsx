import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  width: 100%;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin-left: 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: white;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  margin: 10px 0px;
  border-radius: 12px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf9;
  }
`;

const AttachFileButton = styled.label`
  padding: 5px 10px;
  color: #1d9bf9;
  text-align: center;
  border-radius: 5px;
  border: 1px solid #1d9bf9;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 10px;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SaveButton = styled.button`
  background-color: white;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: white;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin-left: 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const [editFile, setEditFile] = useState<File | null>(null);
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const onEdit = () => {
    setIsEditing(true);
  };

  const onSaveEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || tweet === "" || tweet.length > 180) return;
    try {
      await updateDoc(doc(db, "tweets", id), {
        tweet: editTweet,
      });
      if (editFile) {
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, editFile);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "tweets", id), {
          photo: url,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsEditing(false);
      setEditFile(null);
    }
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    setEditTweet(tweet);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > 1024 * 1024) {
        alert("Too big size!");
        return;
      }
      setEditFile(files[0]);
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <>
            <TextArea
              required
              maxLength={180}
              value={editTweet}
              onChange={(e) => setEditTweet(e.target.value)}
            />
            <SaveButton onClick={onSaveEdit}>Save</SaveButton>
            <CancelButton onClick={onCancelEdit}>Cancel</CancelButton>
            <AttachFileButton htmlFor="EditFile">
              {editFile ? "Photo Added ✅" : "Add photo"}
            </AttachFileButton>
            <AttachFileInput
              onChange={onFileChange}
              type="file"
              id="EditFile"
              accept="image/*"
            />
          </>
        ) : (
          <>
            <Payload>{tweet}</Payload>
            {user?.uid === userId ? (
              <>
                <EditButton onClick={onEdit}>Edit</EditButton>
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
              </>
            ) : null}
          </>
        )}
      </Column>
      <Column>{photo ? <Photo src={photo}></Photo> : null}</Column>
    </Wrapper>
  );
}
