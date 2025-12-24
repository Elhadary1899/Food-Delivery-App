export default function FloatingMessageCard({message}){
    return(
         <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow"
          style={{
            backgroundColor: "#7FA9A3",
            color: "white",
            padding: "15px 25px",
            borderRadius: "20px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1050,
          }}
        >
          ✅ {message}
        </div>
    )
}