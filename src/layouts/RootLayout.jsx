import React, { useState, useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useRecoilState } from "recoil";
import {
  avatarState,
  companyNameState,
  userNameState,
} from "../atoms/avatarAtom";
import { supabase } from "../supabase/clientapp";

export default function RootLayout({ userEmail, userId }) {
  const [avatar, setAvatar] = useRecoilState(avatarState);
  const [userName, setUserName] = useRecoilState(userNameState);
  const [companyName, setCompanyName] = useRecoilState(companyNameState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("collab_users")
          .select("collab_user_avatar_url, collab_user_name, company_name")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }

        if (data) {
          setAvatar(data.collab_user_avatar_url); // Update Recoil state
          setUserName(data.collab_user_name);
          setCompanyName(data.company_name);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  //, setAvatar, setCompanyName, setUserName

  return (
    <Grid templateColumns='repeat(6, 1fr)' bg='gray.50'>
      <GridItem as='main' colSpan={6} p='20px' bg='blue.400' w='100%'>
        {" "}
        {/* Span the full width for the Navbar */}
        <Navbar
          userEmail={userEmail}
          userId={userId}
          avatar={avatar}
          userName={userName}
          companyName={companyName}
          loading={loading}
        />
      </GridItem>
      <GridItem as='main' colSpan={6} pt='10px' pl='40px' pr='40px' pb='40px'>
        {" "}
        {/* Span the full width for the Outlet */}
        <Outlet />
      </GridItem>
    </Grid>
  );
}
