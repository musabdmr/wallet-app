import React, { useEffect, useState } from "react";
import axios from "axios";
import backgroundImage from "../assets/sendmoney.jpg";
import styled from "styled-components";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Link } from "react-router-dom";

const Container = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HalfContainer = styled.div`
  position: fixed;
  right: 4%;
  top: 10%;
  width: 30%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 113, 146, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: white;
`;

const Input = styled.input`
  width: 50%;
  height: 10%;
  margin: 20px 0;
  background: rgba(0, 113, 146, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: white;
  text-align: left;
  padding-left: 10px;
  &::placeholder {
    color: white;
  }
`;

const SpecialInput = styled(Input)`
  background: rgba(255, 0, 0, 0.25);
  border: 2px solid rgba(255, 0, 0, 0.5);
`;
const Home = styled.button`
  position: absolute;
  top: 2%;
  left: 3%;
  width: 6vw;
  height: 6vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(18, 230, 7, 0.618);
    box-shadow: 0 8px 32px 0 rgba(7, 183, 33, 0.464);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: white;
  cursor: pointer;
  border-radius: 50%;
`;
const StyedLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: large;
`;

const Button = styled.button`
  width: 50%;
  height: 10%;
  margin: 20px 0;
  background: rgba(0, 113, 146, 0.8);
  border-radius: 10px;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const SendMoneyP = () => {
  const [amount, setAmount] = useState("");
  const [wAddress, setWAddress]= useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      console.log("Token:", storedToken); // Token'i konsola yazdırın
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    // Axios interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          console.log("Token:", token); // Token'i konsola yazdırın
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor when component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  const handleSend = async () => {
    try {
      const dataToSend = { amount , wAddress };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token added to request:", token);
      } else {
        console.log("No token available");
      }

      const response = await axios.post(
        "http://localhost:8080/api/v1/sendMoney",
        dataToSend,
        config
      );
      if (response.status === 200) {
        console.log("Data sent successfully");
      } else {
        console.error("Failed to send data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container>
      <Home>
        <StyedLink to="/Master">
          <HomeRoundedIcon />
        </StyedLink>
      </Home>
      <HalfContainer>
        <SpecialInput
          placeholder="AMOUNT"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          placeholder="TO W-ADDRESS"
          value={wAddress}
          onChange={(e) => setWAddress(e.target.value)}
        />
       
        <Button onClick={handleSend}>SEND</Button>
      </HalfContainer>
    </Container>
  );
};

export default SendMoneyP;
