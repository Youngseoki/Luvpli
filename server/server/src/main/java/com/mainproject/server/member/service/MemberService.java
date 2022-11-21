package com.mainproject.server.member.service;

import com.mainproject.server.auth.utils.CustomAuthorityUtil;
import com.mainproject.server.auth.utils.ErrorResponder;
import com.mainproject.server.exception.BusinessException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.member.dto.MemberPatchDto;
import com.mainproject.server.member.entity.Member;
import com.mainproject.server.member.jwt.JwtTokenizer;
import com.mainproject.server.member.jwt.RefreshToken;
import com.mainproject.server.member.repository.MemberRepository;
import com.mainproject.server.member.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final JwtTokenizer jwtTokenizer;
    private final CustomAuthorityUtil customAuthorityUtil;
    private final TokenRepository tokenRepository;

    public void savedToken(String token) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setRefreshToken(token);
        tokenRepository.save(refreshToken);
    }

    public Member updateMember(Member member, Long memberId) {

        Member findMember = verifyExistsMember(memberId);

        Optional.ofNullable(member.getName())
                .ifPresent(name -> findMember.setName(name));
        Optional.ofNullable(member.getPicture())
                .ifPresent(picture -> findMember.setPicture(picture));
        Optional.ofNullable(member.getModifiedAt())
                .ifPresent(modifiedAt -> findMember.setModifiedAt(modifiedAt));

        Member updateMember = memberRepository.save(findMember);

        return updateMember;
    }

    public Member followMember(Long memberId) {
        Member findMember = verifyExistsMember(memberId);

        Member updateMember = memberRepository.save(findMember);

        return updateMember;
    }

    public Member findMember(Long memberId) {

        Member findMember = verifyExistsMember(memberId);
        memberRepository.save(findMember);

        return findMember;

    }

    public Page<Member> findMembers(int page, int size) {

        Page<Member> findMembers =
                memberRepository.findAll(PageRequest.of(page, size, Sort.by("memberId").descending()));

        return findMembers;
    }

    public void logoutMember(HttpServletRequest request){

        String refreshToken = request.getHeader("RefreshToken").substring(6);
        RefreshToken token = tokenRepository.findByRefreshToken(refreshToken).get();

        tokenRepository.deleteById(token.getTokenId());
    }

    public ResponseEntity refresh(HttpServletRequest request, HttpServletResponse response) {

        String refreshToken = request.getHeader("RefreshToken").substring(6);

        Boolean validateRefreshToken = jwtTokenizer.validateToken(refreshToken);
        Boolean isRefreshToken = jwtTokenizer.existsRefreshToken(refreshToken);

        if (validateRefreshToken && isRefreshToken){
            String email = jwtTokenizer.getUserEmail(refreshToken);
            String role = memberRepository.findByEmail(email).get().toString();
            List<GrantedAuthority> authorities = customAuthorityUtil.stringToGrantedAuthority(role);

            String newAccessToken = jwtTokenizer.createNewToken(email, authorities);

            response.setHeader("Authorization", "bearer"+newAccessToken);
            return new ResponseEntity<>("Refresh OK", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Refresh Failed", HttpStatus.NOT_FOUND);
        }
    }


    private Member verifyExistsMember(Long memberId) {

        return memberRepository.findById(memberId).orElseThrow(
                () -> {throw new BusinessException(ExceptionCode.MEMBER_NOT_EXISTS);
                });
    }
}
