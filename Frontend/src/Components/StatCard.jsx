const StatCard = ({
    title,
    categories = [],
    gradient = "linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%)",
}) => {
    return (
        <div
            className="card border-0 shadow-sm"
            style={{
                borderRadius: "15px",
                background: gradient,
            }}
        >
            <div className="card-body p-4">
                <div
                    className="fw-bold mb-3"
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#fff"
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexWrap: "wrap",
                    }}
                >
                    {categories.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <span
                                className="text-muted"
                                style={{ fontSize: "15px", color: "#fff" }}
                            >
                                {item.category}
                            </span>

                            <span
                                className="fw-bold"
                                style={{ fontSize: "15px", color: "#fff" }}
                            >
                                {item.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatCard;