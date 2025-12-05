export default function ProductCard({ data }) {
    return (
        <div style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            width: "250px"
        }}>
            <h3>{data.name}</h3>
            <p>{data.description}</p>
            <strong>{data.price} €</strong>
        </div>
    );
}
