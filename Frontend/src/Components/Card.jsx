const Card = ({ title, children }) => {
    return (
        <div
            className="card border-0 shadow-sm h-100"
            style={{
                borderRadius: "15px",
                overflow: "hidden",
            }}
        >
            <div className="card-body p-4">
                <h5
                    className="fw-bold mb-3 border-b border-slate-400"
                    style={{ fontSize: "16px", fontWeight: 600 }}
                >
                    {title}
                </h5>

                <div style={{ width: "100%", minWidth: 0 }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Card;