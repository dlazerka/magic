package name.dlazerka.magic;

import java.io.IOException;
import java.util.Properties;
import java.util.logging.Logger;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RaspberryOnloginServlet extends HttpServlet {
	@SuppressWarnings("unused")
	private static final Logger logger = Logger.getLogger(RaspberryOnloginServlet.class.getName());

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		Session session = Session.getDefaultInstance(new Properties());
		Message msg = new MimeMessage(session);
		try {
			// Must be app admin.
			msg.setFrom(new InternetAddress("dlazerka@gmail.com"));
			msg.addRecipient(RecipientType.TO, new InternetAddress("dlazerka@gmail.com"));
			msg.addHeader("Return-Path", "<>");// mute bounces
			msg.addHeader("List-Id", "Raspberry Onlogin <raspberry@magic.dlazerka.name>");
			String type = req.getParameter("PAM_TYPE");
			msg.setSubject(type + "");
			msg.setText(composeMessageBody(req));
			Transport.send(msg);
		} catch (MessagingException e) {
			throw new IOException(e);
		}
	}

	private String composeMessageBody(HttpServletRequest req) {
		StringBuilder sb = new StringBuilder();
		for (Object paramKey : req.getParameterMap().keySet()) {
			String[] paramValues = (String[]) req.getParameterMap().get(paramKey);
			for (String paramValue : paramValues) {
				sb.append(paramKey).append(": ").append(paramValue).append('\n');
			}
		}
		return sb.toString();
	}

}
