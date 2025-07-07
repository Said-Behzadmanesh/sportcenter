package com.ecommerce.sportscenter.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Log4j2
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtHelper jwtHelper;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtHelper jwtHelper, UserDetailsService userDetailsService) {
        this.jwtHelper = jwtHelper;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain) throws ServletException, IOException {
       String reqHeader = req.getHeader("Authorization");
       log.info("Header: {}", reqHeader);
       String username = null;
       String token = null;
       if(reqHeader != null && reqHeader.startsWith("Bearer")) {
           token = reqHeader.substring(7);
           try {
               username = this.jwtHelper.getUserNameFromToken(token);
           } catch (IllegalArgumentException| ExpiredJwtException | MalformedJwtException ex ) {
               log.info("Illegal argument while fetching username");
               ex.printStackTrace();
           }
       } else {
           log.info("JWT token dosen't begin with Bearer string");
       }

       if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
           // fetch user detail
           UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
           Boolean validateToken = this.jwtHelper.validateToken(token, userDetails);
           if(validateToken){
               // set the authentication
               UsernamePasswordAuthenticationToken authenticationToken =
                       new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());
               authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
               SecurityContextHolder.getContext().setAuthentication(authenticationToken);
           } else {
               log.info("Validation failed");
           }
       }

       filterChain.doFilter(req, res);
    }
}
