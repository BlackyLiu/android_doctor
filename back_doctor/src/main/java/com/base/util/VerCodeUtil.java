package com.base.util;

import org.apache.commons.lang.RandomStringUtils;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;

/**
 *    验证码工具类
 * @author admin
 *
 */
public class VerCodeUtil {

	public static void init(HttpServletRequest request, HttpServletResponse response){
		String random=RandomStringUtils.randomAlphanumeric(4);
		SessionContext.setAttribute(request, SessionContext.IDENTIFY_CODE_KEY, random);
		response.setContentType("image/jpeg");
		response.addHeader("pragma", "NO-cache");
		response.addHeader("Cache-Control","no-cache");
		response.addDateHeader("Expries",0);
		int width=116, height=36;
		BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		Graphics g = image.getGraphics();
		//以下填充背景色
		g.setColor(new Color(225,225,225));
		Font DeFont=new Font("SansSerif", Font.PLAIN, 26);
		g.setFont(DeFont);
		g.fillRect(0, 0, width, height);
		//设置字体色
		g.setColor(Color.BLACK);
		g.drawString(random,20,25);
		g.dispose();
		try {
			ServletOutputStream outStream = response.getOutputStream();
			ImageIO.write(image, "JPG", outStream);
			outStream.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}





}
