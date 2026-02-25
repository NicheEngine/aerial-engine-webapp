export default defineEventHandler(() => {
  return `
<h1>Hello Engine</h1>
<h2>Mock Server Api</h2>
<ul>
<li><a href="/api/hello">/api/hello</a></li>
<li><a href="/api/user">/api/user/info</a></li>
<li><a href="/api/menu">/api/menu/all</a></li>
<li><a href="/api/auth/codes">/api/auth/codes</a></li>
<li><a href="/api/auth/login">/api/auth/login</a></li>
<li><a href="/api/upload">/api/upload</a></li>
</ul>
<ul>
<li><a href="/mock/hello">/mock/hello</a></li>
<li><a href="/mock/auth/test">/mock/auth/test</a></li>
<li><a href="/mock/user">/mock/user/info</a></li>
<li><a href="/mock/menu">/mock/menu/all</a></li>
<li><a href="/mock/auth/codes">/mock/auth/codes</a></li>
<li><a href="/mock/auth/login">/mock/auth/login</a></li>
<li><a href="/mock/upload">/mock/upload</a></li>
</ul>
`;
});
