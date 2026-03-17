"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import handleImageClick from "@/lib/game/handleClick";

import styles from "./style.module.css";

export default function MapCreationForm() {
  const [previewUrl, setPreviewUrl] = useState("");
  const [waldoChecked, setWaldoChecked] = useState(false);
  const [wendaChecked, setWendaChecked] = useState(false);
  const [odlawChecked, setOdlawChecked] = useState(false);
  const [wizardChecked, setWizardChecked] = useState(false);
  const [waldoText, setWaldoText] = useState("");
  const [wendaText, setWendaText] = useState("");
  const [odlawText, setOdlawText] = useState("");
  const [wizardText, setWizardText] = useState("");
  const [imageCoordinates, setImageCoordinates] = useState("");
  const previewUrlRef = useRef("");

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
  }

  function checkIfAllInputsEmpty() {
    if (!waldoText && !wendaText && !odlawText && !wizardText) {
      return true;
    }
    return false;
  }

  function onSubmit(e) {
    async function submitData() {
      try {
        const formData = new FormData(e.target);

        const response = await fetch("/api/image/create", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }

    if (checkIfAllInputsEmpty()) {
      alert("Please provide coordinates for at least one character.");
      return;
    } else {
      return submitData();
    }
  }

  return (
    <form
      action=""
      encType="multipart/form-data"
      style={{ width: "100%", paddingTop: "12px" }}
      onSubmit={onSubmit}
    >
      <div
        style={{
          display: "flex",
          padding: "30px",
          alignItems: "center",
        }}
      >
        <div>Level name: </div>
        <input type="text" name="level-name" id="level-name" required />
      </div>

      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        onChange={handleFileChange}
        style={{ padding: "0px 30px" }}
      />

      {previewUrl ? (
        <div className={styles.previewWrapper}>
          <Image
            src={previewUrl}
            alt="Selected map preview"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            loading="eager"
            unoptimized
            onClick={(event) => handleImageClick(event, setImageCoordinates)}
            style={{
              objectFit: "cover",
              cursor: "crosshair",
            }}
          />
        </div>
      ) : null}

      <div style={{ padding: "30px 30px" }}>
        Selected coordinates (original image pixels): {imageCoordinates}
      </div>

      <p style={{ padding: "0px 30px" }}>
        Draw a square around the Waldo character by clicking on the image to
        select the top-left and bottom-right corners of the character.
      </p>
      <br />
      <p style={{ padding: "0px 30px" }}>
        Place both coordinates in the corresponding input fields below. Both
        coordinates should be placed in curly brackets, separated by a comma.
        Example: {"{626, 423},{657, 461}"}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "12px 30px",
          gap: "12px",
        }}
      >
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="waldo"
            id="waldo"
            checked={waldoChecked}
            onChange={() => setWaldoChecked(!waldoChecked)}
          />
          <label htmlFor="waldo">waldo</label>
          {waldoChecked && (
            <input
              type="text"
              name="waldo-coordinates"
              id="waldo-coordinates"
              placeholder="{x,y},{x,y}"
              value={waldoText}
              onChange={(e) => setWaldoText(e.target.value)}
            />
          )}
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="wenda"
            id="wenda"
            checked={wendaChecked}
            onChange={() => setWendaChecked(!wendaChecked)}
          />
          <label htmlFor="wenda">wenda</label>
          {wendaChecked && (
            <input
              type="text"
              name="wenda-coordinates"
              id="wenda-coordinates"
              placeholder="{x,y},{x,y}"
              value={wendaText}
              onChange={(e) => setWendaText(e.target.value)}
            />
          )}
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="odlaw"
            id="odlaw"
            checked={odlawChecked}
            onChange={() => setOdlawChecked(!odlawChecked)}
          />
          <label htmlFor="odlaw">odlaw</label>
          {odlawChecked && (
            <input
              type="text"
              name="odlaw-coordinates"
              id="odlaw-coordinates"
              placeholder="{x,y},{x,y}"
              value={odlawText}
              onChange={(e) => setOdlawText(e.target.value)}
            />
          )}
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="wizard"
            id="wizard"
            checked={wizardChecked}
            onChange={() => setWizardChecked(!wizardChecked)}
          />
          <label htmlFor="wizard">wizard</label>
          {wizardChecked && (
            <input
              type="text"
              name="wizard-coordinates"
              id="wizard-coordinates"
              placeholder="{x,y},{x,y}"
              value={wizardText}
              onChange={(e) => setWizardText(e.target.value)}
            />
          )}
        </div>

        <input type="submit" value="Upload" style={{ alignSelf: "flex-end" }} />
      </div>
    </form>
  );
}
