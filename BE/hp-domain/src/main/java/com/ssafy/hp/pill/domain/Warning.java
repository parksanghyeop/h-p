package com.ssafy.hp.pill.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class Warning {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warning_id")
    private int warningId;

    private String warningContent;

    @OneToMany(mappedBy = "warning", cascade = CascadeType.ALL)
    private List<PillWarning> pillWarnings = new ArrayList<>();
}
