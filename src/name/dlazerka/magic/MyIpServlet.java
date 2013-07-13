package name.dlazerka.magic;

import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;

public class MyIpServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setContentType("application/json");
		resp.setCharacterEncoding("UTF-8");
		Gson gson = new Gson();
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("addr", req.getRemoteAddr());
		map.put("host", req.getRemoteHost());
		map.put("port", "" + req.getRemotePort());
		map.put("user", req.getRemoteUser());
		String json = gson.toJson(map);
		resp.getWriter().write(json);
	}

}
