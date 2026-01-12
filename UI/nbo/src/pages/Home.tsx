import Banner from "../components/Banner";

function Home() {
  const handleClick = () => {
    console.log("Banner button clicked");
  };

  return (
    <Banner
      image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
      title="We have migrated and expanded our content on our Amphenol CS Website."
      description="Find the connector solutions engineered to empower the technologies of tomorrow."
      buttonText="Visit the New Website"
      onButtonClick={handleClick}
    />
  );
}

export default Home;
