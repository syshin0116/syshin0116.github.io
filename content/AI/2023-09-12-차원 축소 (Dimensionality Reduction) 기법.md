---
layout: post
title: 차원 축소 (Dimensionality Reduction) 기법
date: 2023-09-12 15:59 +0900
categories:
  - Deep-Learning
  - 기법
tags: 
math: true
---

## **PCA (Principal Component Analysis)**

- PCA는 선형 차원 축소 방법이다.
- 데이터의 분산을 최대화하는 주성분 방향으로 데이터를 투영한다.
- 주성분은 데이터의 공분산 행렬의 고유벡터로부터 얻어진다.
- PCA는 노이즈 제거, 시각화, 특징 추출 등 다양한 응용 분야에서 사용된다.


```python
from sklearn.decomposition import PCA  
pca = PCA(n_components=2) 
reduced_data = pca.fit_transform(data)
```

## **t-SNE (t-Distributed Stochastic Neighbor Embedding)**

- t-SNE는 비선형 차원 축소 방법이다.
- 고차원에서의 데이터 포인트 간 거리와 저차원에서의 거리 사이의 차이를 최소화한다.
- 주로 고차원 데이터의 시각화에 사용된다.
- t-SNE는 국소적인 구조와 글로벌 구조 모두를 잘 보존한다.

```python
from sklearn.manifold import TSNE  
tsne = TSNE(n_components=2) 
reduced_data = tsne.fit_transform(data)
```


## **UMAP (Uniform Manifold Approximation and Projection)**

- UMAP은 최근에 개발된 비선형 차원 축소 방법이다.
- t-SNE와 비슷하게 국소적인 구조를 잘 보존하지만, 계산 효율성이 더 높다.
- UMAP은 데이터의 위상 구조를 보존하려고 노력한다.
- 시각화 뿐만 아니라, 일반 차원 축소 작업에도 사용될 수 있다.

```python
import umap  
reducer = umap.UMAP() 
reduced_data = reducer.fit_transform(data)
```
