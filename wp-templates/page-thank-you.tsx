import { useEffect, useState } from "react";

export default function ThankYou() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/mailpoet/v1/subscribers/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }), // 👈 IMPORTANT
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "subscribed") {
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div>
      {status === "loading" && <p>Confirming subscription...</p>}
      {status === "success" && <p>🎉 Subscription confirmed!</p>}
      {status === "error" && <p>⚠️ Something went wrong.</p>}
    </div>
  );
}
