const PostCardMedium = () => {
  return (
    <div className="card">
      <img className="card-img-top" src="/img/banners/portfolio-1.jpg" alt="Card image cap" />
      <div className="card-body p-10">
        <strong className="d-inline-block mb-2 text-primary">World</strong>
        <h5 className="mb-0">
          <a className="text-dark" href="#">Featured post</a>
        </h5>
        <div className="mb-1 text-muted">Nov 12</div>
        <p className="card-text mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
        <a href="#">Continue reading</a>
      </div>
    </div>
  )
}
export default PostCardMedium;