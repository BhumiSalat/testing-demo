import React, { useEffect, useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { LeaveScreen } from "./components/screens/LeaveScreen";
import { JoiningScreen } from "./components/screens/JoiningScreen";
import { MeetingContainer } from "./meeting/MeetingContainer";
import { MeetingAppProvider } from "./context/MeetingAppContext";

const App = () => {
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("rslq-humt-uhth");
  const [participantName, setParticipantName] = useState("bhumi");
  const [micOn, setMicOn] = useState(true);
  const [webcamOn, setWebcamOn] = useState(true);
  const [selectedMic, setSelectedMic] = useState({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState({ id: null });

  const [speakerOn, setSpekerOn] = useState(true);
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);

  let url = new URL(window.location.href);
  let searchParams = new URLSearchParams(url.search);
  const participantMode = searchParams.get("mode");

  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

  return (
    <>
      {isMeetingStarted ? (
        <MeetingAppProvider
          selectedMic={selectedMic}
          selectedWebcam={selectedWebcam}
          initialMicOn={micOn}
          initialWebcamOn={webcamOn}
          participantMode={participantMode}
          initialSpeakerOn={speakerOn}
        >
          <MeetingProvider
            config={{
              meetingId: meetingId,
              micEnabled: micOn,
              webcamEnabled: webcamOn,
              name: participantName ? participantName : "TestUser",
              multiStream: false,
            }}
            token={token}
            reinitialiseMeetingOnConfigChange={true}
            joinWithoutUserInteraction={true}
          >
            <MeetingContainer
              onMeetingLeave={() => {
                setToken("");
                setMeetingId("");
                setParticipantName("");
                setWebcamOn(false);
                setMicOn(false);
                setSpekerOn(false);
                setMeetingStarted(false);
                setIsMeetingLeft(true);
              }}
            />
          </MeetingProvider>
        </MeetingAppProvider>
      ) : isMeetingLeft ? (
        <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
      ) : (
        <JoiningScreen
          participantName={participantName}
          setParticipantName={setParticipantName}
          setMeetingId={setMeetingId}
          setToken={setToken}
          setMicOn={setMicOn}
          micEnabled={micOn}
          webcamEnabled={webcamOn}
          speakerEnabled={speakerOn}
          setSpekerOn={setSpekerOn}
          setSelectedMic={setSelectedMic}
          setSelectedWebcam={setSelectedWebcam}
          setWebcamOn={setWebcamOn}
          onClickStartMeeting={() => {
            setMeetingStarted(true);
          }}
          startMeeting={isMeetingStarted}
          setIsMeetingLeft={setIsMeetingLeft}
        />
      )}
    </>
  );
};

export default App;
