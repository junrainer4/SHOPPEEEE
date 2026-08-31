const handleLogout = () => {
  Alert.alert("Log Out", "Are you sure you want to log out?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Log Out",
      style: "destructive",
      onPress: () => router.replace("/login"),
    },
  ]);
};