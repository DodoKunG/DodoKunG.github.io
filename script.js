function updateTemplate() {
  const title = document.getElementById("inputTitle").value;
  const author = document.getElementById("inputAuthor").value;
  const content = document.getElementById("inputContent").value;

  document.getElementById("title").innerText = title;
  document.getElementById("author").innerText = author;
  document.getElementById("content").innerText = content;
}
