package name.dlazerka.magic;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONWriter;

public class MyIpServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setContentType("application/json");
		resp.setCharacterEncoding("UTF-8");
		JSONWriter w = new JSONWriter(resp.getWriter());
		try {
			w.object();
			w.key("addr").value(req.getRemoteAddr());
			w.key("host").value(req.getRemoteHost());
			w.key("port").value(req.getRemotePort());
			w.key("user").value(req.getRemoteUser());
			w.endObject();
		} catch (JSONException e) {
			throw new IOException(e);
		}
	}

}
